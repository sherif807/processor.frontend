import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CompletedDataAnalytics, LiveDataAnalytics, CompletedGraphsVisualization, LiveGraphsVisualization } from './DataVisualization';
import EbayListingView from './EbayListingView';

export default function AnalyticsSlider({ analytics, item }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Slider {...settings}>
      <div key="history" className="p-0">
        <CompletedDataAnalytics analytics={analytics} completedUrl={item.links?.completedUrl} />
        <EbayListingView data={item.prices?.ebayCompletedData} />
        <CompletedGraphsVisualization data={item.prices?.ebayCompletedData} completedUrl={item.links?.completedUrl} />
      </div>
      <div key="live" className="p-0">
        <LiveDataAnalytics analytics={analytics} />
        <EbayListingView data={item.prices?.ebayLiveData} />
        <LiveGraphsVisualization data={item.prices?.ebayLiveData} liveUrl={item.links?.liveUrl} />
      </div>
    </Slider>
  );
}
