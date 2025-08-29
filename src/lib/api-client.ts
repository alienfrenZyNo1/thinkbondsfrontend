// Toggleable client: real vs mock
export class ApiClient {
  private useMock: boolean;

  constructor(useMock: boolean = false) {
    this.useMock = useMock;
  }

  async get(url: string) {
    if (this.useMock) {
      // Return mock data
      return this.getMockData(url);
    }
    // Make real API call
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, data: any) {
    if (this.useMock) {
      // Return mock data
      return this.getMockData(url);
    }
    // Make real API call
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  private getMockData(url: string) {
    // Return mock data based on URL
    return Promise.resolve({ message: `Mock data for ${url}` });
  }
}