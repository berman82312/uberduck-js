type optionsType = {
  basicAuthToken?: string;
};

export class Http {
  async get(url: string, options?: optionsType) {
    const headers = this._makeHeader(options);
    return fetch(url, { headers }).then((res) => res.json());
  }

  async post(url: string, payload: object, options?: optionsType) {
    const headers = this._makeHeader(options);
    return fetch(url, {
      body: JSON.stringify(payload),
      headers,
      method: "POST",
    }).then((res) => res.json());
  }

  _makeHeader(options?: optionsType) {
    let headers: {
      "content-type": string;
      Authorization?: string;
    } = {
      "content-type": "application/json",
    };
    if (options?.basicAuthToken) {
      headers["Authorization"] = `Basic ${options?.basicAuthToken}`;
    }
    return headers;
  }
}

export default new Http();
