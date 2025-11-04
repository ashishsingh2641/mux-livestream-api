import { Controller, Get, Post, Param } from '@nestjs/common';
import { MuxService } from './mux.service';

@Controller('mux')
export class MuxController {
  constructor(private readonly muxService: MuxService) {}

  @Post('create')
  async createStream() {
    return this.muxService.createLiveStream();
  }

  @Get('all')
  async getStreams() {
    return this.muxService.getLiveStreams();
  }

  @Get('stream/:id')
  async getStream(@Param('id') id: string) {
    return this.muxService.getLiveStream(id);
  }

  @Post('stop/:id')
  async stopStream(@Param('id') id: string) {
    return this.muxService.stopLiveStream(id);
  }

  @Post('stop-all')
  async stopAllStreams() {
    return this.muxService.stopAllLiveStreams();
  }
}
