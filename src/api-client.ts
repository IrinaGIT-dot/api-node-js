import { APIRequestContext } from "playwright";
import { APIResponse, expect, request } from "@playwright/test";
import { StatusCodes } from "http-status-codes";

let baseURL: string = "http://localhost:3000/users";

export class ApiClient {
  static instance: ApiClient;
  private request: APIRequestContext;

  private constructor(request: APIRequestContext) {
    this.request = request;
  }
  public static async getInstance(
    request: APIRequestContext,
  ): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request);
    }
    return ApiClient.instance;
  }

  async createUsers(users: number): Promise<number> {
    for (let i = 0; i < users; i++) {
      const responseUsers = await this.request.post(baseURL);
    }
    return users;
  }

  async getUserByUserId(userID: number): Promise<APIResponse> {
    const response = await this.request.get(`${baseURL}/${userID}`);
    return response;
  }

  async deleteUsers(userID: number): Promise<any> {
    const response = await this.request.get(baseURL);
    const responseBody = await response.json();
    const numberOfObjects = responseBody.length;
    let userIDs = [];
    for (let i = 0; i < numberOfObjects; i++) {
      let userID = responseBody[i].id;
      userIDs.push(userID);
    }
    for (let i = 0; i < numberOfObjects; i++) {
      let response = await this.request.delete(`${baseURL}/${userIDs[i]}`);
    }
  }

  async checkAllUsersDeleted(): Promise<void> {
    const responseAfterDelete = await this.request.get(baseURL);
    expect(responseAfterDelete.status()).toBe(StatusCodes.OK);
    const responseBodyEmpty = await responseAfterDelete.text();
    console.log("All users are deleted");
    if (responseBodyEmpty != "[]") {
      throw new Error("Not all users are deleted");
    }
  }
}
