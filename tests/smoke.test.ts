import { createApp } from '../src/app'; describe('smoke', () => { it('health route exists', async () => { const app = createApp(); expect(app).toBeTruthy(); }); });
