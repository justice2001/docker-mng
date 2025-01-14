import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export function Login({ className, ...props }: React.ComponentProps<'div'>) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">{t('login.welcome')}</h1>
                    <p className="text-balance text-muted-foreground">{t('login.welcome_desc')}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t('login.username')}</Label>
                    <Input id="username" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t('login.password')}</Label>
                      <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                        {t('login.forget_password')}
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    {t('general.login')}
                  </Button>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://img.xjh.me/img/54054310_p0.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
