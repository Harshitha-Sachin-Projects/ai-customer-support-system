jest.mock('../src/services/user.service');

const request = require('supertest');
const app = require('../src/app');
const userService = require('../src/services/user.service');

describe('POST /api/v1/auth/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('registers a customer and returns 201', async () => {
        userService.registerUser.mockResolvedValue({
            id: 1,
            name: 'Harshitha',
            email: 'harshitha@example.com',
            role: 'CUSTOMER'
        });

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Harshitha',
                email: 'harshitha@example.com',
                password: 'SecurePass123'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe('harshitha@example.com');
        expect(userService.registerUser).toHaveBeenCalledWith({
            name: 'Harshitha',
            email: 'harshitha@example.com',
            password: 'SecurePass123'
        });
    });

    it('returns 400 when required fields are missing', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({ email: 'harshitha@example.com' });

        expect(response.status).toBe(400);
        expect(userService.registerUser).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid email address', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Harshitha',
                email: 'not-an-email',
                password: 'SecurePass123'
            });

        expect(response.status).toBe(400);
        expect(userService.registerUser).not.toHaveBeenCalled();
    });

    it('returns 400 when the password is shorter than 8 characters', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Harshitha',
                email: 'harshitha@example.com',
                password: 'short'
            });

        expect(response.status).toBe(400);
        expect(userService.registerUser).not.toHaveBeenCalled();
    });

    it('returns 409 when the email is already registered', async () => {
        userService.registerUser.mockRejectedValue(
            new Error('EMAIL_ALREADY_EXISTS')
        );

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Harshitha',
                email: 'harshitha@example.com',
                password: 'SecurePass123'
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email is already registered');
    });
});
