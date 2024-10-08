import { GetProps } from 'antd';
import Icon from '@ant-design/icons';

type CustomIconComponentProps = GetProps<typeof Icon>;

const MemorySvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="34" width="24" height="38" rx="2" transform="rotate(-90 5 34)" stroke="#333" stroke-width="4" />
    <path d="M20 19H24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 25L35 25" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 34L12 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M20 34L20 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M28 34L28 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M36 34L36 38" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M15 19C15 20.1046 14.1046 21 13 21C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17C14.1046 17 15 17.8954 15 19Z"
      fill="#333"
    />
  </svg>
);

const MemoryOutlined = (props: Partial<CustomIconComponentProps>) => <Icon component={MemorySvg} {...props} />;

export default MemoryOutlined;
