import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity/user.entity';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { generateUsername } from 'src/utils/generate-username';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}
  
  async register(data: Partial<User>) {

    if (!data.email || !data.password) {
      throw new BadRequestException({
        status: 'error',
        message: 'Email and password are required',
      });
    }
  
    const existingUser = await this.userRepo.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });
  
    if (existingUser) {
      throw new ConflictException({
        status: 'error',
        message: 'Email or username already exists',
      });
    }
  
    const hash = await bcrypt.hash(data.password, 10);
  
    // Base username dari email sebelum @
    const baseUsername = data.email.split('@')[0];
    const existingUsernames = (await this.userRepo.find()).map(u => u.username);
    const generatedUsername = generateUsername(baseUsername, existingUsernames);

    const user = this.userRepo.create({
      ...data,
      username: generatedUsername,
      password: hash,
      uuid: uuidv4(),
      has_password: true,
    });

    const savedUser = await this.userRepo.save(user);

    // Generate token
    const token = this.jwtService.sign({ email: savedUser.email }, { expiresIn: '1d' });

    // Simpan token ke DB
    savedUser.password_reset_token = token;
    savedUser.password_reset_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userRepo.save(savedUser);

    // Kirim email
    const verifyUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${token}`;
    await this.emailService.sendVerificationEmail(savedUser.email, verifyUrl);
    
    return {
      status: 'success',
      message: 'Registration successful. Please verify your email.',
      data: {
        id: savedUser.id,
        uuid: savedUser.uuid,
        email: savedUser.email,
        username: savedUser.username,
        full_name: savedUser.full_name,
        role: savedUser.role,
        is_verified: savedUser.is_verified,
      },
    };
  }
  

  async verifyUserEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
  
    if (user.is_verified) return user; // sudah diverifikasi
  
    user.is_verified = true;
    return this.userRepo.save(user);
  }  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email } });
  
    if (!user) return null;
  
    // ✅ Jika akun dari Google dan tidak punya password
    if (!user.has_password) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'This account was registered using Google. Please set a password first to use email login.',
      });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
  
    const { password: _, ...rest } = user;
    return rest;
  }  

  async verifyEmailToken(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userRepo.findOne({ where: { email: payload.email } });
  
    if (
      !user ||
      user.password_reset_token !== token ||
      !user.password_reset_expires ||
      new Date(user.password_reset_expires) < new Date()
    ) {
      throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
    }
  
    user.is_verified = true;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await this.userRepo.save(user);
  
    return {
      status: 'success',
      message: 'Email berhasil diverifikasi',
    };
  }
  

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
  
    const payload = {
      sub: user.id,
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      is_verified: user.is_verified,
    };
  
    const token = this.jwtService.sign(payload, {
      expiresIn: '30d', // ✅ 30 hari
    });
  
    return {
      status: 'success',
      message: 'Login successful',
      access_token: token,
      expires_in: 2592000,
    };
  }
  
    
  async validateGoogleUser(googleUser: any) {
    let user = await this.userRepo.findOne({ where: { email: googleUser.email } });
  
    if (!user) {
      const baseUsername = googleUser.email.split('@')[0];
      const existingUsernames = (await this.userRepo.find()).map(u => u.username);
      const generatedUsername = generateUsername(baseUsername, existingUsernames);

      user = this.userRepo.create({
        email: googleUser.email,
        full_name: googleUser.full_name,
        avatar_url: googleUser.avatar_url,
        username: generatedUsername,
        is_verified: true,
        uuid: uuidv4(),
        role: 'user',
        has_password: false,
      });

      user = await this.userRepo.save(user);
    }
  
    return user;
  }

  async sendSetPasswordEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
  
    if (!user) {
      throw new BadRequestException({ status: 'error', message: 'Email not found' });
    }
  
    if (user.has_password) {
      throw new BadRequestException({ status: 'error', message: 'Password already exists' });
    }
  
    const token = this.jwtService.sign({ email }, { expiresIn: '1d' });
  
    const setPasswordUrl = `${this.configService.get('FRONTEND_URL')}/auth/set-password?token=${token}`;
  
    await this.emailService.sendEmail({
      to: email,
      subject: 'Set your Impactra password',
      html: `<p>Hi ${user.full_name || user.email},</p>
             <p>Click the button below to set your password:</p>
             <a href="${setPasswordUrl}" style="padding: 10px 20px; background: #007BFF; color: white; border-radius: 5px; text-decoration: none;">Set Password</a>
             <p>This link will expire in 24 hours.</p>`
    });
  
    return {
      status: 'success',
      message: 'Set password link has been sent to your email',
    };
  }  

  async setPasswordFromToken(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepo.findOne({ where: { email: payload.email } });
  
      if (!user) throw new Error();
  
      const hash = await bcrypt.hash(newPassword, 10);
      user.password = hash;
      user.has_password = true;
  
      await this.userRepo.save(user);
  
      return {
        status: 'success',
        message: 'Password has been set successfully',
      };
    } catch (err) {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }
  }
  
}
