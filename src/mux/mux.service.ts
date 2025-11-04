import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Mux from '@mux/mux-node';

console.log(process.env.MUX_TOKEN_ID);
@Injectable()
export class MuxService {
  private muxVideo: Mux.Video;

  constructor() {
    const tokenId = process.env.MUX_TOKEN_ID;
    const tokenSecret = process.env.MUX_TOKEN_SECRET;

    if (!tokenId || !tokenSecret) {
      throw new Error(
        'MUX_TOKEN_ID or MUX_TOKEN_SECRET is not set in environment variables',
      );
    }

    const { video } = new Mux({
      tokenId,
      tokenSecret,
    });

    this.muxVideo = video;
  }

  async createLiveStream() {
    try {
      const stream = await this.muxVideo.liveStreams.create({
        playback_policy: ['public'],
        new_asset_settings: { playback_policy: ['public'] },
      });

      return {
        id: stream.id,
        stream_key: stream.stream_key,
        playback_id: stream.playback_ids?.[0]?.id,
        status: stream.status,
      };
    } catch (error: any) {
      console.error('❌ Error creating Mux stream:', error.message || error);
      throw new InternalServerErrorException('Failed to create stream');
    }
  }

  async getLiveStreams() {
    try {
      const response = await this.muxVideo.liveStreams.list();
      const streams = response.data || [];

      return streams.map((stream: any) => ({
        id: stream.id,
        status: stream.status,
        playback_id: stream.playback_ids?.[0]?.id,
        stream_key: stream.stream_key,
      }));
    } catch (error: any) {
      console.error('❌ Error fetching streams:', error.message || error);
      throw new InternalServerErrorException('Failed to fetch live streams');
    }
  }

  async getLiveStream(id: string) {
    try {
      const stream = await this.muxVideo.liveStreams.retrieve(id);
      return {
        id: stream.id,
        playback_id: stream.playback_ids?.[0]?.id,
        status: stream.status,
        stream_key: stream.stream_key,
      };
    } catch (error: any) {
      console.error(
        `❌ Error fetching live stream with id=${id}:`,
        error.message || error,
      );
      throw new InternalServerErrorException('Failed to fetch specific stream');
    }
  }

  /**
   * ✅ Stop (disable) a specific live stream
   */
  async stopLiveStream(id: string) {
    try {
      await this.muxVideo.liveStreams.disable(id);
      return { message: `Live stream ${id} stopped successfully` };
    } catch (error: any) {
      console.error('❌ Error stopping live stream:', error.message || error);
      throw new InternalServerErrorException('Failed to stop live stream');
    }
  }

  /**
   * ✅ Stop (disable) all active live streams
   */
  async stopAllLiveStreams() {
    try {
      const response = await this.muxVideo.liveStreams.list();
      const streams = response.data || [];

      if (streams.length === 0) {
        return { message: 'No active live streams found.' };
      }

      const results = await Promise.all(
        streams.map(async (stream: any) => {
          await this.muxVideo.liveStreams.disable(stream.id);
          return { id: stream.id, status: 'stopped' };
        }),
      );

      return { message: 'All live streams stopped successfully', results };
    } catch (error: any) {
      console.error(
        '❌ Error stopping all live streams:',
        error.message || error,
      );
      throw new InternalServerErrorException('Failed to stop all live streams');
    }
  }
}
