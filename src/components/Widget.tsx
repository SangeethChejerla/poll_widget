import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

import tailwindStyles from '../index.css?inline';

interface Option {
  value: string;
}

interface PollWidgetProps {
  onSubmit?: (data: { question: string; options: Option[] }) => void;
}

export const Widget = ({ onSubmit }: PollWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<Option[]>([{ value: '' }]);

  const widgetRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddOption = () => {
    setOptions([...options, { value: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({ question, options });
    }

    setIsOpen(false);
    setQuestion('');
    setOptions([{ value: '' }]);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      event.currentTarget.tagName.toLowerCase() === 'textarea'
    ) {
      event.preventDefault();
      handleAddOption();
    }
  };

  return (
    <>
      <style>{tailwindStyles}</style>

      <div className="widget fixed bottom-4 right-4 z-50" ref={widgetRef}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className="rounded-full shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleOpen}
            >
              <span className="sr-only">Create Poll</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="9" y2="15" />
                <line x1="15" y1="9" x2="15" y2="15" />
              </svg>
            </Button>
          </PopoverTrigger>
          <AnimatePresence>
            {isOpen && (
              <PopoverContent
                className=" widget w-[350px] rounded-xl p-0"
                align="end"
                sideOffset={5}
              >
                <style>{tailwindStyles}</style>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <form onSubmit={handleSubmit} className="p-6" ref={formRef}>
                    <Label
                      htmlFor="question"
                      className="text-lg font-semibold text-gray-800"
                    >
                      Question:
                    </Label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="mb-4 mt-2 resize-none"
                      placeholder="Enter your poll question here..."
                      onKeyDown={handleKeyDown}
                    />

                    {options.map((option, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3 mb-3"
                        variants={optionVariants}
                      >
                        <Input
                          type="text"
                          value={option.value}
                          onChange={(e) =>
                            setOptions(
                              options.map((o, i) =>
                                i === index ? { value: e.target.value } : o
                              )
                            )
                          }
                          placeholder={`Option ${index + 1}`}
                          className="flex-grow"
                        />
                        {index > 0 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 p-0"
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </Button>
                        )}
                      </motion.div>
                    ))}

                    <div className="flex items-center justify-between mt-2">
                      <Button
                        type="button"
                        onClick={handleAddOption}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        + Add Option
                      </Button>
                      <Button type="submit" className="ml-2">
                        Submit
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      </div>
    </>
  );
};
