import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Auth0User } from 'src/dto';

@Injectable()
export class AuthService {
    private client: AxiosInstance;

    constructor(
        @Inject()
        private readonly configService: ConfigService,
    ) {
        this.refreshClient();
    }
    
    async refreshClient(): Promise<void> {
        const token = await this.askAuth0APIToken();
        this.client = this.createClient(token);
        await this.getUsers();
    }

    createClient(token: string): AxiosInstance {
        const domain = this.configService.getOrThrow('AUTH0_DOMAIN');
        return axios.create({
            baseURL: `https://${domain}/api/v2`,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async getUsers(): Promise<Auth0User[]> {
        const options = { method: 'get', maxBodyLength: Infinity, url: '/users' };
        const { data } = await this.client.request(options);
        return data;
    }

    async getUser(userId: string): Promise<Auth0User> {
        const options = { method: 'get', maxBodyLength: Infinity, url: `/users/${userId}` };
        const { data } = await this.client.request(options);
        return data;
    }
    
    async askAuth0APIToken(): Promise<string> {
        const domain = this.configService.getOrThrow('AUTH0_DOMAIN');
        const audience = this.configService.getOrThrow('AUTH0_AUDIENCE');
        const client_id = this.configService.getOrThrow('AUTH0_CLIENT_ID');
        const client_secret = this.configService.getOrThrow('AUTH0_CLIENT_SECRET');    
        const input = { client_id, client_secret, audience, grant_type: "client_credentials" };
        const options: RequestInit = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) };
        const response = await fetch(`https://${domain}/oauth/token`, options);
        const { access_token } = await response.json();
        return access_token; 
    }
}