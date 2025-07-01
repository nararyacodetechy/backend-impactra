import { Controller, Post, Body, Request, UseGuards, BadRequestException, Query, Get, UnauthorizedException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService, 
        private configService: ConfigService, 
    ) {}

    @Post('register')
    register(@Body() data: Partial<User>) {
        return this.authService.register(data);
    }


    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
    try {
        return await this.authService.verifyEmailToken(token);
    } catch (err) {
        return {
        status: 'error',
        message: err.message || 'Invalid or expired token',
        };
    }
    }


    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);

        if (!user) {
        throw new UnauthorizedException({
            status: 'error',
            message: 'Invalid credentials or email not verified',
        });
        }

        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('google'))
    @Get('google')
    async googleAuth() {
        // Redirect ke Google
    }

    @UseGuards(AuthGuard('google'))
    @Get('google/redirect')
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateGoogleUser(req.user);

    const result = await this.authService.login(user);
        return res.redirect(`${this.configService.get('FRONTEND_URL')}/auth/login/success?token=${result.access_token}`);
    }

    @Post('request-set-password')
    async requestSetPassword(@Body() body: { email: string }) {
        return this.authService.sendSetPasswordEmail(body.email);
    }

    @Post('set-password')
    async setPassword(@Body() body: { token: string, newPassword: string }) {
        return this.authService.setPasswordFromToken(body.token, body.newPassword);
    }

}
