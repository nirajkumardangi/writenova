"use client";

import { X, Loader2, Globe } from "lucide-react";

export default function PublishModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  coverImage,
  setCoverImage,
  topics,
  setTopics,
  editorImages = [],
  publishing,
}) {
  if (!isOpen) return null;

  const parsedTopicsList = topics
    ? topics.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : [];
  const parsedTopicsCount = parsedTopicsList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Story Preview & Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[75vh]">
          {/* Image Preview & Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cover Image Preview</label>
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
              <img
                src={coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Selectable Editor Images */}
            {editorImages && editorImages.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-gray-500">Select cover from images in article</label>
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {editorImages.map((imgUrl, index) => {
                    const isSelected = coverImage === imgUrl;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCoverImage(imgUrl)}
                        className={`relative h-16 w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-gray-50 transition-all duration-200 focus:outline-none cursor-pointer ${
                          isSelected ? "border-black scale-95 shadow-sm" : "border-gray-200/80 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Article image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <span className="bg-black text-white rounded-full p-0.5 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-2.5 h-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
              />
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title *</label>
              <span className={`text-xs ${title.length > 100 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter dynamic title..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-semibold"
            />
          </div>

          {/* Description Excerpt Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description Excerpt *</label>
              <span className={`text-xs ${description.length > 140 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                {description.length}/140
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={140}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a summary of the article..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
            />
          </div>

          {/* Topics Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Topics *</label>
              <span className={`text-xs ${parsedTopicsCount > 5 || parsedTopicsCount === 0 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                {parsedTopicsCount}/5 topics
              </span>
            </div>
            <input
              type="text"
              required
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g. Design, Tech, Productivity"
              className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {parsedTopicsCount > 5 && (
              <p className="text-[11px] text-red-500 font-medium">Please enter a maximum of 5 topics.</p>
            )}
            {parsedTopicsCount > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {parsedTopicsList.slice(0, 5).map((topic, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium capitalize">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-250 text-gray-800 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                publishing ||
                !title.trim() ||
                !description.trim() ||
                title.length > 100 ||
                description.length > 140 ||
                parsedTopicsCount === 0 ||
                parsedTopicsCount > 5
              }
              className="flex-1 py-3 px-4 bg-black text-white hover:bg-neutral-800 disabled:bg-gray-100 disabled:text-gray-400 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed select-none shadow-sm"
            >
              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
