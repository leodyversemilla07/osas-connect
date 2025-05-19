import React, { useState } from 'react';

export default function CalendarComponent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sample events data
  const events = [
    { date: new Date(2025, 3, 10), title: 'Staff Meeting', type: 'meeting' },
    { date: new Date(2025, 3, 15), title: 'Scholarship Committee Review', type: 'task' },
    { date: new Date(2025, 3, 20), title: 'Career Fair', type: 'event' },
    { date: new Date(2025, 3, 25), title: 'Student Leadership Workshop', type: 'event' },
  ];

  const renderHeader = () => {
    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-base font-medium text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    const dateFormat = "d";
    const rows = [];
    
    // Adjust start date to begin with the first day of the week
    startDate.setDate(1 - startDate.getDay());
    
    // Create weeks
    while (startDate <= endDate) {
      let days = [];
      
      // Create days for a week
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        const isCurrentMonth = currentDate.getMonth() === currentMonth.getMonth();
        
        // Check if there are events on this date
        const dateEvents = events.filter(event => 
          event.date.getDate() === currentDate.getDate() && 
          event.date.getMonth() === currentDate.getMonth() && 
          event.date.getFullYear() === currentDate.getFullYear()
        );
        
        const isToday = 
          currentDate.getDate() === new Date().getDate() &&
          currentDate.getMonth() === new Date().getMonth() &&
          currentDate.getFullYear() === new Date().getFullYear();
        
        const isSelected = 
          currentDate.getDate() === selectedDate.getDate() &&
          currentDate.getMonth() === selectedDate.getMonth() &&
          currentDate.getFullYear() === selectedDate.getFullYear();
        
        days.push(
          <div
            key={currentDate.toString()}
            onClick={() => setSelectedDate(new Date(currentDate))}
            className={`relative p-1 text-center text-sm hover:bg-gray-100 rounded cursor-pointer
              ${!isCurrentMonth ? 'text-gray-300' : ''}
              ${isToday ? 'bg-indigo-50 text-indigo-600' : ''}
              ${isSelected ? 'bg-indigo-100' : ''}
            `}
          >
            {currentDate.getDate()}
            {dateEvents.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <span className="h-1 w-1 bg-indigo-500 rounded-full"></span>
              </div>
            )}
          </div>
        );
        
        startDate.setDate(startDate.getDate() + 1);
      }
      
      rows.push(
        <div key={startDate.toString()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
    }
    
    return <div>{rows}</div>;
  };

  const renderEvents = () => {
    const dayEvents = events.filter(event => 
      event.date.getDate() === selectedDate.getDate() && 
      event.date.getMonth() === selectedDate.getMonth() && 
      event.date.getFullYear() === selectedDate.getFullYear()
    );
    
    const eventTypeClasses = {
      meeting: 'bg-sky-100 text-sky-800 border-sky-200',
      task: 'bg-amber-100 text-amber-800 border-amber-200',
      event: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    
    if (dayEvents.length === 0) {
      return (
        <div className="mt-3 text-sm text-gray-500 text-center py-3">
          No events scheduled for this day
        </div>
      );
    }
    
    return (
      <div className="mt-3">
        <h3 className="text-xs font-medium text-gray-500 mb-1">
          EVENTS FOR {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </h3>
        <div className="space-y-1">
          {dayEvents.map((event, index) => (
            <div 
              key={index} 
              className={`text-sm px-2 py-1 rounded border ${eventTypeClasses[event.type as keyof typeof eventTypeClasses]}`}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="border-t mt-2 pt-2">
        {renderEvents()}
      </div>
    </div>
  );
}