import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguagesIcon } from 'lucide-react';
import { SUPPORTED_LANG } from '@/i18n';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import apiRequest from '@/utils/api-request';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router';

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Login({ className, ...props }: React.ComponentProps<'div'>) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onLogin(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
    apiRequest.post('/auth/login', values).then(res => {
      console.log(res.data.token);
      localStorage.setItem('token', res.data.token)
      navigate('/')
    }).catch(e => {
      toast({
        title: '登陆失败！',
        description: e.response.data?.message || e.message,
        variant: "destructive"
      })
    })
  }

  const onLanguageChange = (val: string) => {
    if (!val) return;
    i18n.changeLanguage(val);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">{t('login.welcome')}</h1>
                    <p className="text-balance text-muted-foreground">{t('login.welcome_desc')}</p>
                  </div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onLogin)}  className="space-y-4">
                      <FormField control={form.control} name='username' render={({field}) => (
                        <FormItem>
                          <FormLabel>{t('login.username')}</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name='password' render={({field}) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center">
                              <Label htmlFor="password">{t('login.password')}</Label>
                              <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                                {t('login.forget_password')}
                              </a>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input id="password" type="password" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full">
                        {t('general.login')}
                      </Button>
                    </form>
                  </Form>

                  <Separator />
                    <div className="flex justify-center items-center gap-2">
                      <Select value={i18n.resolvedLanguage} onValueChange={onLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <LanguagesIcon size="1rem" />
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANG.map((lang) => (
                            <SelectItem value={lang.language}>{lang.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                </div>
              </div>
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
