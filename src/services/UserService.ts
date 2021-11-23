import axios, { AxiosResponse } from 'axios';

import { IAuthenticable, ILogin } from '@/interfaces/all';

export default class UserService {
  private readonly URL = 'http://localhost:8080';

  public async login(login: ILogin): Promise<AxiosResponse<IAuthenticable>> {
    return axios.post<AxiosResponse<IAuthenticable>, any>(
      `${this.URL}/login`,
      login
    );
  }
}
