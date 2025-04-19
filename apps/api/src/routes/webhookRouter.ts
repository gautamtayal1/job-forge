import { verifyWebhook } from '@clerk/express/webhooks'
import prisma from '@repo/db/client';
import express, { Request, Response, Router } from 'express'
import { Webhook } from 'svix'

interface WebhookEvent {
  data: {
    id: string;
    [key: string]: any;
  };
  type: string;
  [key: string]: any;
}

const webhookRouter: Router = express.Router()

webhookRouter.post('/webhooks', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  try {
    // Get the webhook signature from the headers
    const svixId = req.headers['svix-id'] as string
    const svixTimestamp = req.headers['svix-timestamp'] as string
    const svixSignature = req.headers['svix-signature'] as string
    

    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET
    
    if (!svixId || !svixTimestamp || !svixSignature || !secret) {
      res.status(400).send('Missing required webhook headers or secret')
      return
    }
    const wh = new Webhook(secret)
    
    const payload = Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body)
    
    const evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent

    const eventType = evt.type
    
    if (eventType === 'email.created') {
      await prisma.user.create({
        data: {
          email: evt.data.to_email_address,
        }
      })
    }
    res.send('Webhook received')
  } catch (err) {
    console.error('Error verifying webhook:', err)
    res.status(400).send('Error verifying webhook')
  }
})

export default webhookRouter