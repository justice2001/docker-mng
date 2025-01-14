import './App.css'
import Layout from "@/components/layout/Layout.tsx";
import {Button} from "@/components/ui/button.tsx";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <>
        <Layout>
            <Button onClick={() => setCount(count + 1)}>{ t('test', { n: count }) }</Button>
        </Layout>
    </>
  )
}

export default App
