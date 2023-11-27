// import SplitViews from './split-views';
// import DragSelect from './drag-select';
// import Croper from './cropper';
// import ResizeElement from './resize-element';
import ImageCropper from './image-cropper';
import bgImg from '@/assets/bg001.jpg';
import './app.css';

function App() {
  return (
    <div className="app">
      {/* <SplitViews /> */}
      {/* <Croper imgUrl={bgImg} /> */}
      <div style={{ width: 500, height: 400, margin: '100px auto' }}>
        <ImageCropper imageUrl={bgImg} />
      </div>
    </div>
  );
}

export default App;
