const showcaseProjects = [
  {
    title: 'Complete Yard Makeover',
    location: 'Virginia Beach',
    beforeImg: 'photo-4.jpg',
    afterImg: 'photo-5.jpg',
  },
  {
    title: 'Custom Patio Installation',
    location: 'Suffolk',
    beforeImg: 'photo-6.jpg',
    afterImg: 'photo-7.jpg',
  },
  {
    title: 'Tree & Brush Cleanup',
    location: 'Norfolk',
    beforeImg: 'photo-8.jpg',
    afterImg: 'photo-9.jpg',
  },
];

export default function Showcase() {
  return (
    <section className="bg-gradient-to-r from-stone-100 to-stone-50 py-20 px-6 bg-speckle" id="showcase">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-4 text-stone-800">
            See The Transformation
          </h2>
          <p className="text-xl text-stone-600">
            Real projects. Real results. Happy Hampton Roads homeowners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl border border-stone-100"
            >
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img
                    src={project.beforeImg}
                    alt={`${project.title} - Before`}
                    className="w-full h-40 object-cover group-hover:grayscale transition duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-stone-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    BEFORE
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={project.afterImg}
                    alt={`${project.title} - After`}
                    className="w-full h-40 object-cover group-hover:contrast-125 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
                    AFTER
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg text-stone-800">{project.title}</h3>
                <p className="text-sm text-stone-500">{project.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
