import './VideoLounge.css'

const VideoLounge = ({ videoOptions, selectedVideoId, setSelectedVideoId, selectedVideo }) => {
  return (
    <section className="section video" id="video-lounge">
      <div className="section__header">
        <h2>1990s Christmas Video Lounge</h2>
        <p className="section__sub">Pick a VHS-worthy YouTube embed and let it loop while you tackle plaza trivia.</p>
      </div>
      <div className="video__layout">
        <div className="video__picker">
          {videoOptions.map((video) => (
            <button
              key={video.id}
              className={`video__option ${selectedVideoId === video.id ? 'video__option--active' : ''}`}
              onClick={() => setSelectedVideoId(video.id)}
            >
              <div>
                <p className="video__title">{video.title}</p>
                <p className="video__desc">{video.description}</p>
              </div>
              <span aria-hidden>▶</span>
            </button>
          ))}
        </div>
        <div className="video__player" aria-label={`Now playing ${selectedVideo.title}`}>
          <div className="video__frame">
            <iframe
              title={selectedVideo.title}
              src={`${selectedVideo.embedUrl}?rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="panel__hint">YouTube embeds are public rips — queue one as lobby music while unlocking tiles.</p>
        </div>
      </div>
    </section>
  )
}

export default VideoLounge
