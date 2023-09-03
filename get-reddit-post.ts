const b = document.querySelector('b') as HTMLElement
const btn = document.getElementById('btn') as HTMLButtonElement
const input = document.getElementById('input') as HTMLInputElement
const output = document.getElementById('output') as HTMLDivElement
const download = document.getElementById('download') as HTMLAnchorElement

const h1 =  document.createElement('h1')
const p = document.createElement('p')

const metadata = {
  reddit: 'https://www.reddit.com',
  youtubePrefixShade: 'https://youtu.be/',
  youtubePrefixUrl: 'https://www.youtube.com/',
  type: 'text/markdown',
  length: 100
}

const method = {
  replace: /\/([^\/]*)$/,
  deleteHashTag: ({ text }: { text: string | undefined}) => {
    const newText = text?.startsWith('#') ? text?.slice(2) : text
    return newText
  },
}

const customErrors = {
  ifNotExistSubReddit: 'No se encontro el subReddit',
  ifTheURLIsBad: 'Vea si la url la puso bien'
}

interface Reddit {
  title: string
  selftext: string
  author: string
  media: {
    oembed: {
      author_name: string
      author_url: string
      provider_name: string
      thumbnail_url: string
      title: string
    }
    type: string
  } | null | undefined
  subreddit_name_prefixed: string
  url: string
}

type GetMedia = Reddit["media"]

const templateMedia = (media: GetMedia, thumbnail: string) => {
  const oembed = media?.oembed

  const author = oembed?.author_name
  const videoUrl = oembed?.author_url
  const videoTitle = oembed?.title

  const template=`
   \`\`\`vid
    ${thumbnail}
  \`\`\`

[${author} - ${videoTitle}](${videoUrl})`
  

  const boolean = media?.oembed && thumbnail.startsWith(metadata.youtubePrefixShade) || thumbnail.startsWith(metadata.youtubePrefixUrl)

  if (boolean) {
    return template
  }

  return ''
}

const templatePhoto = ({ thumbnail, title }: { thumbnail: string, title: string }) => {
  
  const template = `
![${title}](${thumbnail})
`

  if (thumbnail.endsWith('.jpg')) {
    return template
  }

  return ''
}

const getRedditPost = async ({ url }: { url: string }) => {
  try {
    const res = await fetch(url)
  
    if (!res.ok) {
      output.innerText = customErrors.ifNotExistSubReddit
      return
  }

    const json = await res.json()
    const data:Reddit = json[0].data.children[0].data
  
    const { title, selftext, author,  media, subreddit_name_prefixed, url: thumbnail } = data

    const arriba = `
---
tag: reddit
author: ${author}
subreddit: ${subreddit_name_prefixed}
---

# ${title}

${selftext}

${templateMedia(media, thumbnail)}
${templatePhoto({ thumbnail, title })}

[${subreddit_name_prefixed}](${input.value})`


    b ? b.innerText = title : null
    output.appendChild(h1)
    output.innerText = arriba  
  } catch (error) {
    output.innerText = customErrors.ifTheURLIsBad
  }
}

//------------------------------------------------------------------

btn.addEventListener('click', () => {
  const values = input.value

  if (!values.startsWith(metadata.reddit)) {
    output.innerText = `La URL tiene que comenzar con ${metadata.reddit}`
   return
  }

  const reg = method.replace
  const url = values.replace(reg, '.json')

  input.value = ''

  getRedditPost({ url })
})

const downloadReddit = () => {
  const text = output.innerText
  const textContent = document.querySelector('b')?.innerText
  const newTitle = textContent?.slice(0, metadata.length)

  const name = `${newTitle}.md`

  let file = new Blob([text], {type: metadata.type});

  download.href = URL.createObjectURL(file);
  download.download = name;
}

download.addEventListener('click', downloadReddit)


