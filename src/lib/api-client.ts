// Toggleable client: real vs mock
export class ApiClient {
  private useMock: boolean;

  constructor(useMock: boolean = false) {
    this.useMock = useMock;
  }

  async get<T = unknown>(url: string): Promise<T> {
    if (this.useMock) {
      // Return mock data
      return this.getMockData<T>(url);
    }
    // Make real API call
    const response = await fetch(url);
    return response.json() as Promise<T>;
  }

  async post<TResponse = unknown, TBody = unknown>(
    url: string,
    data: TBody
  ): Promise<TResponse> {
    if (this.useMock) {
      // Return mock data
      return this.getMockData<TResponse>(url);
    }
    // Make real API call
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json() as Promise<TResponse>;
  }

  private getMockData<T = unknown>(url: string): Promise<T> {
    // Return mock data based on URL
    return Promise.resolve({ message: `Mock data for ${url}` } as unknown as T);
  }
}
