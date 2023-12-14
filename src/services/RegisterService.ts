import { HttpApiServices } from "./HttpApiServices";

export class RegisterService extends HttpApiServices{
  register(body: any){
    return this.post('/auth/register', body);
  }
}