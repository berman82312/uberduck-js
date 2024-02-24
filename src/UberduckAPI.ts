import type { Payload } from "./types";
import http from "./http";

export class UberduckAPI {
  async GET(url: string, params?: Payload) {
    let pathUrl = `https://api.uberduck.ai/${url}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      pathUrl = pathUrl + "?" + searchParams.toString();
    }
    const result = await http.get(pathUrl, {
      basicAuthToken: btoa(
        `${process.env.UBERDUCK_KEY}:${process.env.UBERDUCK_SECRET}`
      ),
    });

    // console.log("Uberduck GET response: ", pathUrl, "\n", result);
    return result;
  }
  async POST(url: string, payload: object) {
    const result = await http.post(`https://api.uberduck.ai/${url}`, payload, {
      basicAuthToken: btoa(
        `${process.env.UBERDUCK_KEY}:${process.env.UBERDUCK_SECRET}`
      ),
    });
    // console.log("Uberduck POST response: ", result);
    return result;
  }

  async generateLyrics(payload: object) {
    const result = await this.POST("tts/lyrics", payload);
    return result;
  }

  async listVoices(payload: Payload) {
    const result = await this.GET("voices", payload);
    return result;
  }

  async listVoiceSamples(uuid: string) {
    const result = await this.GET(`voices/${uuid}/samples`);
    return result;
  }

  async listBackingTracks() {
    const result = await this.GET(`reference-audio/backing-tracks`);
    return result;
  }

  async generateFreestyle(payload: {
    backing_track: string;
    voicemodel_uuid: string;
    lyrics: string[][];
    lines?: number;
    title: string;
    render_video?: boolean;
    metadata?: {
      addWatermark?: boolean;
    };
  }) {
    const result = await this.POST("tts/freestyle", payload);

    return result;
  }

  async customPrompt(key: string, payload?: any) {
    const url = `templates/deployments/${key}/generate`;
    const result = await this.POST(url, {
      variables: payload ?? {},
    });

    return result;
  }
}

export default new UberduckAPI();
