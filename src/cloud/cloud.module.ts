import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';

@Module({
  providers: [CloudService],
  controllers: [CloudController],
  exports: [CloudService],
})
export class CloudModule {}
