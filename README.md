# 🌐 MitraChain — Web3 Membership Platform for UMKM  

![MitraChain Banner](https://zhwegqlelhhdirlmilcq.supabase.co/storage/v1/object/public/LOGO/banner.png)

## ✨ Overview  
**[MitraChain](mitrachain.store)** is a revolutionary Web3 membership platform that bridges the gap between **UMKM (Small Businesses)** and their **customers**.  
Built on **Cardano Blockchain**, MitraChain enables transparent, secure, and rewarding membership experiences — empowering local communities with decentralized technology.

💠 **Transparent. Secure. Rewarding.**  

## **Now Online**
- **[User Website](mitrachain.store)**
- **[SMBs/Admin Website](admin.mitrachain.store)**

---

## 🧩 Key Features  

### 🛡️ Blockchain Security  
Built on **Cardano’s sustainable blockchain infrastructure**, ensuring every transaction is **secure, transparent, and immutable**.  

### ⚡ Instant Rewards  
Enjoy **real-time membership benefits** and **loyalty rewards** powered by **smart contracts**.  

### 👥 Community Driven  
Empowering local **UMKM** businesses to build lasting relationships with their customers through digital memberships.  

---

## 🧱 Tech Stack  

| Layer | Technology |
|-------|-------------|
| 🖥️ Frontend | [Next.js](https://nextjs.org/) + [React](https://reactjs.org/) |
| 💅 UI Components | [shadcn/ui](https://ui.shadcn.com/) + [TailwindCSS](https://tailwindcss.com/) |
| 🗃️ Backend | [Supabase](https://supabase.com/) (Database + Auth + Storage) |
| 💳 Payment Gateway | [Midtrans](https://midtrans.com/) |
| 🪙 Blockchain Integration | [Cardano Network](https://cardano.org/) + [NMKR API](https://www.nmkr.io/) + [Blockfrost](https://blockfrost.io/) |
| ⚙️ Structure | Monorepo (TurboRepo / Nx) |

---

## 🔗 Third-Party Integrations  

MitraChain integrates several third-party APIs to power blockchain features, payments, and membership management:

| Service | Purpose |
|----------|----------|
| 🧩 **Supabase** | Authentication, database, and storage. |
| 💳 **Midtrans** | Payment gateway for transactions and memberships. |
| 💎 **NMKR API** | NFT minting and project management on Cardano. |
| 🔗 **Blockfrost** | Cardano blockchain explorer & API integration. |
| ⏱️ **Cron Jobs** | Automations for membership renewal and reward updates. |

---

## 🚀 Getting Started  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/MitraChain/MitraChain.git
cd mitrachain
```

### 2️⃣ Install Dependencies  
```bash
pnpm install
```

### 3️⃣ Setup Environment Variables  
Create a `.env.local` file in the root directory:  

🔒 Keep your `.env.local` file **private** — never commit it to Git!  

---

### 4️⃣ Run Development Server  
```bash
pnpm dev
```
Then open [http://localhost:3000](http://localhost:3000) and [http://localhost:3001](http://localhost:3001) 🌍  

---

## 📁 Project Structure  

```
mitrachain/
├── .turbo/                     # Turborepo cache and build outputs
├── .vscode/                    # VSCode workspace settings
├── apps/                       # Main applications
│   ├── fe-mitra/               # Frontend for Mitra (UMKM dashboard)
│   ├── fe-user/                # Frontend for User / Customer
│   └── smart-contracts/        # Cardano smart contract integration
│
├── packages/                   # Shared libraries and components
│   ├── ui/                     # Shared shadcn UI components
│   ├── lib/                    # Reusable utilities (hooks, API clients, etc.)
│   └── config/                 # Shared configuration across apps
│
├── node_modules/               # Dependencies
```
---

## 🌍 Vision  
MitraChain aims to create a **trusted digital ecosystem** where **UMKM can thrive** using blockchain technology —  
rewarding loyalty, building trust, and promoting transparency in every interaction.  

> “Empowering Small Businesses through Decentralized Trust.” 💙  

---

## 🧑‍💻 Contributors  
- 👤 **Ferdinand** — Developer
- 👤 **Arif** — Developer
- 👤 **Farhan** — Developer
- 🧠 Contributions are welcome!  
  Feel free to open a Pull Request or submit an Issue.  

---

## ⚖️ License  
This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more details.  

---

⭐ **MitraChain** — Connecting Businesses and Communities through Blockchain Technology.
