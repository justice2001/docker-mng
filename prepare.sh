cd common
pnpm install
pnpm build

cd ../daemon
pnpm install
pnpm link ../common

cd ../panel
pnpm install
pnpm link ../common

cd ../ui
pnpm install
