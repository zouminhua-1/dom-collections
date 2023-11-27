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
      <ImageCropper imageUrl={bgImg} />
    </div>
  );
}

export default App;
