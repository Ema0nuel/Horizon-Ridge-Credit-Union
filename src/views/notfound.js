import ErrorView from "/src/images/errorPage/page_not_found.svg"

const notfound = () => {
  return ({
    html: `
      <div class="flex flex-col items-center justify-center min-h-screen px-4 bg-brand-light dark:bg-brand-dark transition-colors opacity-100">
        <img class="max-w-full mb-8 h-auto object-contain" alt="Page Not Found" src="${ErrorView}" />
        <h1 class="text-center mt-0 mb-2 text-2xl leading-8 font-bold text-brand-navy dark:text-brand-sun">This Page Does Not Exist</h1>
        <p class="text-center max-w-xl mb-6 text-base leading-6 font-normal text-brand-gray dark:text-brand-light">
          Sorry, the page you are looking for could not be found. It's just an accident that was not intentional.
        </p>
        <a href="/" data-nav class="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition dark:border-brand-teal dark:text-brand-teal dark:hover:bg-brand-teal dark:hover:text-white">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Home</span>
        </a>
      </div>
    `,
  })
}

export default notfound
