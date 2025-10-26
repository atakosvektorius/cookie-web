import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import Testimonials from "@/partials/Testimonials";
import { Button, Feature } from "@/types";
import { FaCheck } from "react-icons/fa/index.js";
import React, { useEffect } from "react";
import Link from "next/link";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



interface HomeFeatureProps {
  id: string;
  feature: Feature; 
  index: number;
}


const HomeFeature = ({ id, feature, index }: HomeFeatureProps) => {
  return (
    <section
      id={id}
      key={index}
      className={`section-sm ${index % 2 === 0 && "bg-gradient"}`}
    >
      <div className="container">
        <div className="row items-center justify-between">
          <div
            className={`mb:md-0 mb-6 md:col-5 ${
              index % 2 !== 0 && "md:order-2"
            }`}
          >
            <ImageFallback
              src={feature.image}
              height={480}
              width={520}
              alt={feature.title}
              style={{
                borderRadius: 15
              }}
            />
          </div>
          <div
            className={`md:col-7 lg:col-6 ${
              index % 2 !== 0 && "md:order-1"
            }`}
          >
            <h2
              className="mb-4"
              dangerouslySetInnerHTML={markdownify(feature.title)}
            />
            <p
              className="mb-8 text-lg"
              dangerouslySetInnerHTML={markdownify(feature.content)}
            />
            <ul>
              {feature.bulletpoints.map((bullet: string) => (
                <li className="relative mb-4 pl-6" key={bullet}>
                  <FaCheck className={"absolute left-0 top-1.5"} />
                  <span dangerouslySetInnerHTML={markdownify(bullet)} />
                </li>
              ))}
            </ul>
            {feature.button.enable && (
              <a
                className="btn btn-primary mt-5"
                href={feature.button.link}
              >
                {feature.button.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}





const Home = () => {
  const homepage = getListPage("homepage/_index.md");
  const testimonial = getListPage("sections/testimonial.md");
  const callToAction = getListPage("sections/call-to-action.md");
  const { frontmatter } = homepage;
  const {
    banner,
    features,
  }: {
    banner: { title: string; image: string; video: string; content?: string; button?: Button };
    features: Feature[];
  } = frontmatter;


  return (
    <>
      <SeoMeta />
      <section 
        id="pradzia" 
        className="flex items-center" 
        style={{ 
          width: '90vw', 
          height: '100vh',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Centering Wrapper */}
          <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            
              {/* Text Section */}
              <div className="lg:col-8 md:col-10 sm:col-10 z-10 pr-10">
                <h1 className="mb-4 text-white font-bold" dangerouslySetInnerHTML={markdownify(banner.title)} />
                <p className="mb-8 text-white" dangerouslySetInnerHTML={markdownify(banner.content ?? "")} />
                {banner.button!.enable && (
                  <Link
                    className="btn btn-outline-primary"
                    href={banner.button!.link}
                  >
                    {banner.button!.label}
                  </Link>
                )}
              </div>
              
              {/* Video Section */}
              {banner.video && (
                <>
                  <div className="video-section relative lg:col-6 md:col-4 sm:col-0" style={{ marginLeft: '-10%' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <img src={banner.video} />
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          

          <div className="flex justify-center" style={{paddingBottom: '5vh'}}>
            <KeyboardArrowDownIcon style={{fontSize: 120, color: '#505050'}}/>
          </div>

        </div>
      </section>


      <HomeFeature id={""} feature={features[0]} index={0}/>
      <HomeFeature id={""} feature={features[1]} index={1}/>
      {/* <HomeFeature id={""} feature={features[2]} index={2}/> */}


    </>
  );
};

export default Home;
