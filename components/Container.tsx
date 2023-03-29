import Link from "next/link";
import Splitter from './Splitter';



import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

type ContainerProps = ComponentProps<{
  title: string;
}>;

const Container: React.FC<ContainerProps> = ({ title }: ContainerProps) => (
  <>
  <div className="pt-24">
    <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left min-h-500">
        <p className="uppercase tracking-loose w-full">
          This is Uniform demo
        </p>
        <h1
          className="my-4 text-5xl font-bold leading-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
    </div>
  </div>
  <Splitter />
</>
);

registerUniformComponent({
  type: 'Container',
  component: Container
});


