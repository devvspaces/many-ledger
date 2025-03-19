This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


For the Crypto Wallet:

The main goal is for the admin to have full control over what users see on their dashboard. This is the breakdown of user and admin features

User Features:

1. Users should be able to send and receive crypto.


2. Users should be able to convert crypto to other cryptos or to fiat currency (like USD, Euro, Pound, etc.) before withdrawing to their bank. There should be a form where users input their bank details. After clicking proceed, it should show a “pending” status until the admin approves or emails the user.


3. Users must have a PIN to complete any transactions. The admin needs to create a unique PIN for each user, similar to how it works on the Robust Ledger site. (Too Important)


4. The site should have KYC (Know Your Customer) verification, 2FA (Two-Factor Authentication), and other security features that the admin must approve.


5. Automated messages should be sent to users based on their activities, like sign-ups and logins. Let us know if you want us to draft these messages for you.


6. The site should offer a wallet connect option.


7. The UI should be clean, with a default dark mode option and a button to switch to a light theme.


8. Each user must have a 12-word recovery phrase for recovering their account if they forget their password. ("less important", you may just add default 12 words that uniquely appear in each user's acct if the other would be tedious for you) 


9. The interface should have four main buttons: Buy, Send, Receive, and KYC.


10. Show real-time prices for all cryptocurrency holdings.



Admin Features:

1. Admin should be able to manage and edit everything on the platform, such as adjusting balances (adding or subtracting) for each crypto or fiat asset.


2. Admin should be notified about all activities on the site and approve user actions.


3. Admin should be able to change wallet addresses and QR codes manually.


4. Admin should be able to chat with users for support.

5: Add and delete a crypto or fiat holding 


The overall thing is that the admin needs full control over the platform. The design should be dark-themed by default, with the option to switch to light mode. Additionally, emails should be properly delivered (not landing in spam). Please review all the features on the Robust Ledger website and follow them step by step for my platform. I would greatly appreciate if you implement those features there.