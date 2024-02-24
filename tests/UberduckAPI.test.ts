import { expect, test, describe, beforeEach, vi } from "vitest";

import UberduckAPI from "../src/UberduckAPI";

vi.stubEnv("UBERDUCK_KEY", "testing_key");
vi.stubEnv("UBERDUCK_SECRET", "testing_secret");
global.fetch = vi.fn();

function createFetchResponse(data: any) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}

describe("Uberduck API", () => {
  beforeEach(() => {
    global.fetch.mockReset();
  });

  test("test generateLyrics", async () => {
    const mockResponse = {
      title: "Lofi Magic",
      lyrics: [
        [
          "Lofi is awesome, it's like a warm embrace",
          "Soothing my soul, putting me in a peaceful space",
          "Beats like a gentle breeze, melodies like a lullaby",
          "It's a masterpiece of sound, elevating me so high",
          "The crackle of vinyl, like rain on a tin roof",
          "It's a symphony of simplicity, the ultimate proof",
          "Of music's power to transport and heal",
          "Lofi is the remedy, the magic I feel",
          "The warmth of a tape deck, the hum of a record player",
          "Lofi's like a time machine, taking me back to a place that's familiar",
          "Nostalgia and comfort, wrapped in a blanket of sound",
          "It's a treasure chest of emotion, waiting to be found",
        ],
      ],
    };
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const requestBody = {
      subject: "lofi is awesome",
      lines: [16],
    };

    const result = await UberduckAPI.generateLyrics({
      subject: "lofi is awesome",
      lines: [16],
    });

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith("https://api.uberduck.ai/tts/lyrics", {
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
        "content-type": "application/json",
      },
      method: "POST",
    });
    expect(result).toStrictEqual(mockResponse);
  });

  test("test listVoices", async () => {
    const mockResponse = [
      {
        category: "",
        display_name: "German Male",
        is_private: true,
        name: "german-male",
        voicemodel_uuid: "28e13832-5bff-45f5-8b19-126d9e771f5b",
        language: "german",
      },
      {
        category: "",
        display_name: "Oursong English",
        is_private: true,
        name: "oursong-english",
        voicemodel_uuid: "bb25b435-7e5c-4cab-9b0b-ff14b3fdd50b",
        language: "english",
      },
    ];
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await UberduckAPI.listVoices({
      mode: "tts-reference",
    });

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/voices?mode=tts-reference",
      {
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });

  test("test listVoiceSamples", async () => {
    const mockResponse = [
      {
        transcription:
          "Now this is a story all about how my life got flipped turned upside down and I'd like to take a minute Just sit right there I'll tell you how I became the prince of a town called Bel Air.",
        url: "https://uberduck-audio-permalink.s3.amazonaws.com/84a12281-6270-4de6-acd7-4baeb1ad9e7d/audio.wav?AWSAccessKeyId=AKIAY5QT7KYNL5RNFMAE&Signature=QX0cnnn9jTOumFzY2F1brPBi5fI%3D&Expires=1706673464",
      },
      {
        transcription:
          "They told him don't you ever come around here, don't wanna see your face, you better disappear. The fire's in their eyes and their words are really clear, so beat it, just beat it.",
        url: "https://uberduck-audio-permalink.s3.amazonaws.com/d1a26746-5bea-44f5-be73-fbe8de4b2a26/audio.wav?AWSAccessKeyId=AKIAY5QT7KYNL5RNFMAE&Signature=ca6j8y6CLhnvuIVXsgiY1dhfynU%3D&Expires=1706673464",
      },
    ];
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await UberduckAPI.listVoiceSamples(
      "639f5a27-edbc-444f-bfe9-c7b62aa014f8"
    );

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/voices/639f5a27-edbc-444f-bfe9-c7b62aa014f8/samples",
      {
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });

  test("test listBackingTracks", async () => {
    const mockResponse = {
      backing_tracks: [
        {
          bpm: 102.0,
          uuid: "726f4142-c85a-4afc-a1e8-e76342692329",
          name: "$eries A (Hip Hop)",
          source: "Custom",
          bucket: "uberduck-reference-audio",
          path: "1735361/c89cdbdf-9795-423b-8fee-600dbb1a3bc1-RnBH 8 (102bpm Dm).wav",
          is_public: true,
          verses: [
            {
              label: "Verse 1",
              start: 9.4118,
              length_in_measures: 20,
            },
          ],
        },
        {
          bpm: 109.0,
          uuid: "2008268e-583a-407d-9ae9-b2a8593a35b4",
          name: "Burn rate (Hip Hop)",
          source: "Custom",
          bucket: "uberduck-reference-audio",
          path: "1735361/19027b9a-f81e-47f6-9a83-e3af51bb7416-RnBH 15 (109bpm Bm).wav",
          is_public: true,
          verses: [
            {
              label: "Verse 1",
              start: 17.604874376922428,
              length_in_measures: 16,
            },
          ],
        },
      ],
    };
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await UberduckAPI.listBackingTracks();

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/reference-audio/backing-tracks",
      {
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });

  test("test generateFreestyle", async () => {
    const mockResponse = {
      mix_url:
        "https://uberduck-outputs-permalink.s3-us-west-2.amazonaws.com/test.wav",
      vocals_url:
        "https://uberduck-outputs-permalink.s3-us-west-2.amazonaws.com/test.mp3",
      title: "This is a mocked response",
      render_uuid: "d8067893-6cc6-40ea-85dd-aae92f717fa6",
      render_video_response:
        "https://uberduck-temporary-assets.s3-us-west-2.amazonaws.com/test.mp4",
      timestamps: null,
      bpm: 100,
    };
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const requestBody = {
      backing_track: "05da2fd9-469e-479b-81ff-b7192ebc78b9",
      voicemodel_uuid: "237fe1a9-ce23-4785-95ec-f4f4bb88c06a",
      lyrics: [
        [
          "Lofi beats, they be soothing my soul",
          "Like a warm blanket on a winter night, they console",
          "The crackle and pop, like a fire's gentle roar",
          "It's like stepping through a portal to another world, I explore",
          "The melodies, they paint pictures in my mind",
          "Like a brushstroke of calmness, leaving worries behind",
          "The rhythm and flow, they carry me away",
          "Like a gentle breeze on a hot summer day",
        ],
      ],
      lines: 8,
      title: "New beat",
      render_video: true,
    };

    const result = await UberduckAPI.generateFreestyle(requestBody);

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/tts/freestyle",
      {
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
        method: "POST",
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });

  test("test customPrompt", async () => {
    const mockResponse = {
      choices: [
        {
          finish_reason: "stop",
          index: 0,
          logprobs: null,
          message: {
            content:
              "俺の心は燃えてる　夢を追いかけて\n日々の戦い　立ち向かって\n街中を駆け抜ける　俺のスタイル\n誰も止められない　この炎のような情熱\n\n時には苦しい　時には辛い\nでも俺は立ち止まらない　前だけ見て\n夢を叶えるために　全力で走る\nこの街の王になる　その日まで\n\n誰もが俺の名前を知るだろう\n俺の音楽が響く　どこまでも\n日本中を揺るがす　俺のメロディ\nこれが俺の物語　誰にも邪魔させない\n\n俺の血は熱い　俺の魂は強い\nこのリリックが刻む　俺の遺産\n日本の誇りを背負って　進む\n俺のラップが変える　未来を見せる",
            role: "assistant",
            function_call: null,
            tool_calls: null,
          },
        },
      ],
      created: 1708759229,
      id: "test",
      model: "gpt-35-turbo",
      object: "chat.completion",
      usage: {
        completion_tokens: 296,
        prompt_tokens: 45,
        total_tokens: 341,
      },
    };
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const result = await UberduckAPI.customPrompt("japanese-lyrics");

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/templates/deployments/japanese-lyrics/generate",
      {
        body: JSON.stringify({ variables: {} }),
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
        method: "POST",
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });

  test("test customPrompt with variables", async () => {
    const mockResponse = {
      choices: [
        {
          finish_reason: "stop",
          index: 0,
          logprobs: null,
          message: {
            content:
              "俺の心は燃えてる　夢を追いかけて\n日々の戦い　立ち向かって\n街中を駆け抜ける　俺のスタイル\n誰も止められない　この炎のような情熱\n\n時には苦しい　時には辛い\nでも俺は立ち止まらない　前だけ見て\n夢を叶えるために　全力で走る\nこの街の王になる　その日まで\n\n誰もが俺の名前を知るだろう\n俺の音楽が響く　どこまでも\n日本中を揺るがす　俺のメロディ\nこれが俺の物語　誰にも邪魔させない\n\n俺の血は熱い　俺の魂は強い\nこのリリックが刻む　俺の遺産\n日本の誇りを背負って　進む\n俺のラップが変える　未来を見せる",
            role: "assistant",
            function_call: null,
            tool_calls: null,
          },
        },
      ],
      created: 1708759229,
      id: "test",
      model: "gpt-35-turbo",
      object: "chat.completion",
      usage: {
        completion_tokens: 296,
        prompt_tokens: 45,
        total_tokens: 341,
      },
    };
    fetch.mockResolvedValue(createFetchResponse(mockResponse));

    const data = { lyrics: "japanese" };

    const result = await UberduckAPI.customPrompt("japanese-lyrics", data);

    expect(process.env.UBERDUCK_KEY).toBe("testing_key");
    expect(process.env.UBERDUCK_SECRET).toBe("testing_secret");

    expect(fetch).toHaveBeenCalledWith(
      "https://api.uberduck.ai/templates/deployments/japanese-lyrics/generate",
      {
        body: JSON.stringify({ variables: data }),
        headers: {
          Authorization: `Basic ${btoa("testing_key:testing_secret")}`,
          "content-type": "application/json",
        },
        method: "POST",
      }
    );
    expect(result).toStrictEqual(mockResponse);
  });
});
