import { GetProps } from 'antd';
import Icon from '@ant-design/icons';

type CustomIconComponentProps = GetProps<typeof Icon>;

const ChipsetSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M38 8H10C8.89543 8 8 8.89543 8 10V38C8 39.1046 8.89543 40 10 40H38C39.1046 40 40 39.1046 40 38V10C40 8.89543 39.1046 8 38 8Z"
      fill="none"
      stroke="#333"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <path d="M30 18H18V30H30V18Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9092 2V8V2Z" fill="none" />
    <path d="M14.9092 2V8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9092 40V46V40Z" fill="none" />
    <path d="M14.9092 40V46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24 2V8V2Z" fill="none" />
    <path d="M24 2V8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24 40V46V40Z" fill="none" />
    <path d="M24 40V46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.0908 2V8V2Z" fill="none" />
    <path d="M33.0908 2V8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.0908 40V46V40Z" fill="none" />
    <path d="M33.0908 40V46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 14.9092H8H2Z" fill="none" />
    <path d="M2 14.9092H8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M40 14.9092H46H40Z" fill="none" />
    <path d="M40 14.9092H46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 24H8H2Z" fill="none" />
    <path d="M2 24H8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M40 24H46H40Z" fill="none" />
    <path d="M40 24H46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 33.0908H8H2Z" fill="none" />
    <path d="M2 33.0908H8" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M40 33.0908H46H40Z" fill="none" />
    <path d="M40 33.0908H46" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ChipsetOutlined = (props: Partial<CustomIconComponentProps>) => <Icon component={ChipsetSvg} {...props} />;

export default ChipsetOutlined;
