const SERVER_HOST = "http://localhost:8000";

export async function http(request: RequestInfo): Promise<any> {
  const response: Response = await fetch(request, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
}

export async function get(
  path: string,
  args: RequestInit = { method: "get" }
): Promise<any> {
  return await http(new Request(SERVER_HOST + path, args));
}

export async function post(
  path: string,
  body?: any,
  args: RequestInit = {
    method: "post",
    body: JSON.stringify(body),
  }
): Promise<any> {
  return await http(new Request(SERVER_HOST + path, args));
}

export async function put(
  path: string,
  body: any,
  args: RequestInit = {
    method: "put",
    body: JSON.stringify(body),
  }
): Promise<any> {
  return await http(new Request(SERVER_HOST + path, args));
}
