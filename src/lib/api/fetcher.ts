interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: object;
}

export async function fetcher<T>(url: string, options?: RequestOptions): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API call error to ${url}:`, error);
    throw error;
  }
}
