import { Module } from '@nestjs/common';
import { MuxModule } from './mux/mux.module';

@Module({
  imports: [MuxModule],
})
export class AppModule {}
