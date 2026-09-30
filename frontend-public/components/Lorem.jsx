const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
];

export default function Lorem({ paragraphs = 3, sections = [] }) {
  return (
    <div className="prose max-w-none text-movistar-gray-med">
      {sections.length > 0
        ? sections.map((s, i) => (
            <div key={i} className="mb-6">
              <h2 className="mb-2 text-xl font-bold text-movistar-navy">
                {s}
              </h2>
              <p>{LOREM[i % LOREM.length]}</p>
              <p>{LOREM[(i + 1) % LOREM.length]}</p>
            </div>
          ))
        : Array.from({ length: paragraphs }).map((_, i) => (
            <p key={i} className="mb-4">
              {LOREM[i % LOREM.length]}
            </p>
          ))}
    </div>
  );
}
