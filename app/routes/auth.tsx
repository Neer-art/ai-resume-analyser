import React from 'react';

export const meta = () => ([
  { title: 'Resumind | auth' },
  { name: 'description', content: 'Authentication page' }
]);

const Auth = () => {
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-lg p-8">
          <div className="flex flex-col gap-2 items-center text-center">
            <h1>Welcome</h1>
            <h2>Log in to continue your job journey</h2>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;