// ProductForm.js
import React, {useState, useMemo, useEffect} from 'react';
import ImageSlider from './ImageSlider';
import TitleSection from './TitleSection';
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import "easymde/dist/easymde.min.css";
import MarkdownIt from 'markdown-it';

const ProductForm = ({
  inputTitle, setInputTitle, imageResults, selectedImages,
  toggleImageSelection, handleSubmit, isSubmitting,
  handleGenerateTitle, isLoading, handleRefreshImages, getBestDescription, description, setDescription
}) => {
    
    const [markdown, setMarkdown] = useState(description || '');
    const mdParser = new MarkdownIt();
    const isSubmitDisabled = selectedImages.length === 0 || inputTitle.trim() === '' || isSubmitting;


    const handleMarkdownChange = (value) => {
        setMarkdown(value);
        setDescription(value);
    };

    const editorOptions = useMemo(() => ({
        spellChecker: false,
        autofocus: false,
        previewRender: (plainText) => {
            // Use markdown-it to convert Markdown to HTML
            const renderedHtml = mdParser.render(plainText);
            // Return HTML wrapped in a div with the prose class
            return `<div class="prose">${renderedHtml}</div>`;
        }
    }), []);

    useEffect(() => {
        // Update the markdown state whenever the description prop changes
        setMarkdown(description);
    }, [description]);

    return (
        <>
            {isLoading && (
                <div className="absolute top-4 right-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}
            <TitleSection 
                inputTitle={inputTitle} 
                setInputTitle={setInputTitle} 
                handleGenerateTitle={handleGenerateTitle} 
            />
            <ImageSlider 
                imageResults={imageResults} 
                selectedImages={selectedImages} 
                toggleImageSelection={toggleImageSelection} 
            />

            <div className="flex justify-between items-center mt-4">
                <button 
                    onClick={handleRefreshImages}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Refresh Images
                </button>

                {/* <button 
                    onClick={getBestDescription}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate Description {isLoading && (<span className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent ml-2"></span>)}
                </button> */}
            </div>


            <div className="markdown-editor-container">
                <SimpleMDE
                    value={markdown}
                    onChange={handleMarkdownChange}
                    options={editorOptions}
                />
            </div>      


            <div className="flex justify-center mt-4">
                <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitDisabled}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-black'} hover:bg-gray-700 focus:outline-none disabled:bg-gray-300`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            <div>

            </div>
        </>
    );
};

export default ProductForm;
