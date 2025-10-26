import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import SubscribeForm from "@/components/SubscribeForm";
import { RegularPage } from "@/types";




// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams = () => {
  const getRegularPages = getSinglePage("pages");

  const regularPages = getRegularPages.map((page: RegularPage) => ({
    regular: page.slug,
  }));

  return regularPages;
};

// for all regular pages
const RegularPages = ({ params }: { params: { regular: string } }) => {
  const regularData = getSinglePage("pages");
  const data = regularData.filter(
    (page: RegularPage) => page.slug === params.regular,
  )[0];
  const { frontmatter, content } = data;
  const { title, meta_title, description, image, 
    subscribe_enabled, subscribe_text, subscribe_input_form, subscribe_post_url } = frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />
      <div className="flex justify-center">
        <section className="section lg:col-10 xl:col-10">
          <div className="container">
            <div className="content">
              <MDXContent content={content} />
            </div>
            {subscribe_enabled &&
              <SubscribeForm 
                subscribe_text={subscribe_text}
                subscribe_input_form={subscribe_input_form}
                subscribe_post_url={subscribe_post_url}
              />
            }
          </div>
        </section>
      </div>
    </>
  );
};

export default RegularPages;
