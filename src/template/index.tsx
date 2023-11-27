import { HtmlHTMLAttributes } from 'react';

interface Iprops extends HtmlHTMLAttributes<HTMLDivElement> {}

const index = (props: Iprops) => {
  return <div>index</div>;
};

export default index;
