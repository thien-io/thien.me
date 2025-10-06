import React from 'react';
import type { Metadata } from 'next';
import { contact } from '@/data/contact';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BlurFade from '@/components/ui/blur-fade';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'My Contacts',
};

export default function Contact() {
  return (
    <div className=''>
      <BlurFade delay={0.2}>
        <div className='space-y-6'>
          {contact.map((contact, index) => (
            <div className='border-none'>
              <div>
                <a
                  key={index}
                  href={contact.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group hover:opacity-80 transition-opacity duration-200 flex flex-row justify-between items-center text-sm '
                >
                  {contact.social}
                  <CardDescription>{contact.username}</CardDescription>
                </a>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>
    </div>
  );
}
