// Content for the home page.
export interface Project {
  number: string;
  name: string;
  category: string;
  description: string;
  details: string;
  tags: string[];
}

export const projects: Project[] = [
  { number: '01', name: 'WhatSaS', category: 'Secure messaging', description: 'An end-to-end encrypted messaging platform.', details: 'Implemented authentication, encrypted message storage and secure key management for the platform.', tags: ['C++', 'Python', 'JavaScript', 'Solidity'] },
  { number: '02', name: 'LaRo Beam', category: 'Connected hardware', description: 'A portable emergency communicator for places without mobile coverage.', details: 'Contributed to a prototype using LoRa mesh networking and GPS for messaging and location sharing, with a physical SOS feature and a 3D-printed enclosure.', tags: ['LoRa', 'GPS', 'Prototyping', 'Product design'] },
  { number: '03', name: 'Rep It', category: 'Android application', description: 'A simple way to organise workouts and track progress.', details: 'Built a native Android app for creating sessions and recording exercises, sets and repetitions.', tags: ['Kotlin', 'Android', 'Mobile'] },
  { number: '04', name: 'ISE Jobs Board', category: 'Allocation system', description: 'Matching students and placement opportunities with care.', details: 'Built an ISE course jobs board replica, including an automated allocation algorithm that assigns students to roles based on preferences and constraints.', tags: ['Python', 'SQL', 'Algorithms'] },
  { number: '05', name: 'Linux IPC Driver', category: 'Systems engineering', description: 'Secure inter-process communication at the operating-system level.', details: 'Developed a Linux kernel driver in C, using encryption and synchronisation with mutexes and semaphores.', tags: ['C', 'Linux', 'Concurrency'] },
  { number: '06', name: 'System Hardware Monitor', category: 'Desktop application', description: 'A clear view of a laptop’s hardware in real time.', details: 'Combined native libraries with a Java Swing interface to display CPU, memory, storage and system information.', tags: ['Java', 'Swing', 'Native libraries'] },
  { number: '07', name: 'Dino Game', category: 'Interactive application', description: 'A playful desktop game built around responsive player input.', details: 'Explored object-oriented programming, event-driven interfaces and game logic with Java and Swing.', tags: ['Java', 'Swing', 'Game logic'] },
  { number: '08', name: 'Sreejita’s Obby', category: 'Creative development', description: 'A playful portfolio inspired by checkpoint-based games.', details: 'Built an interactive portfolio where visitors explore checkpoints to discover my education, experience and projects.', tags: ['React', 'TypeScript', 'Three.js', 'React Three Fiber'] },
];

export const capabilities = [
  { number: '01', title: 'Languages', description: 'Java · C · C++ · C# · Ruby · Python · TypeScript · JavaScript · Kotlin' },
  { number: '02', title: 'Frameworks & libraries', description: 'Ruby on Rails · Flask · React · .NET · Blazor Hybrid · WPF' },
  { number: '03', title: 'Tools & platforms', description: 'Git & GitHub · Linux · Azure · AWS · Postman · Vercel · Firebase · Supabase' },
];
