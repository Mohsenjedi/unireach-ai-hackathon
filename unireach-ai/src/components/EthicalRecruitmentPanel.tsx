'use client';

export default function EthicalRecruitmentPanel() {
  const checklistItems = [
    {
      category: 'Transparency',
      items: [
        'Clear tuition and fee disclosure',
        'Accurate program duration information',
        'Honest employment outcome statistics'
      ]
    },
    {
      category: 'Fair Practices',
      items: [
        'No discriminatory admission policies',
        'Equal opportunity access to information',
        'Fair scholarship distribution'
      ]
    },
    {
      category: 'Student Protection',
      items: [
        'Safe campus environment guarantee',
        'Support services for international students',
        'Clear refund and withdrawal policies'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Ethical recruitment checklist</h3>

      <div className="space-y-6">
        {checklistItems.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {category.category}
            </h4>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-green-500 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}