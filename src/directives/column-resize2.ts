type Header = { minWidth: number; maxWidth: number; key: string } | null | undefined

const map = new WeakMap<HTMLElement, () => void>()
export default {
  mounted(el: HTMLElement, { value }: { value: Header[] }) {
    const table = el
    const dataHeader = value

    let isDragging = false
    let currentWidth = 0
    let newWidth = 0
    let startX = 0
    let currentHeadKey = ''
    let currentHead: Header = null
    let currentTDELList: NodeListOf<HTMLElement> | null = null

    const mouseup = () => {
      isDragging = false
      document.body.style.cursor = ''
      currentWidth = 0

      if (newWidth !== 0 && !!currentHead) {
        console.log('newWidth')
        currentHead.minWidth = newWidth
        currentHead.maxWidth = newWidth
      }
      console.log(newWidth)
      newWidth = 0
      currentHead = null
      currentTDELList = null
      table.classList.remove('resize-cursor-th')
    }
    const mousedown = (key: string, e: MouseEvent) => {
      currentHead = dataHeader.find((item) => item && item.key === key)
      console.log(currentHead)
      if (currentHead) {
        currentWidth = currentHead.maxWidth || currentHead.minWidth
        startX = e.clientX
        isDragging = true
        currentHeadKey = key
        document.body.style.cursor = 'col-resize'
        currentTDELList = document.querySelectorAll(`[data="${currentHeadKey}"]`)
      }
    }

    const mousemove = (e: MouseEvent) => {
      if (isDragging) {
        requestAnimationFrame(() => {
          if (currentHead !== null && currentTDELList !== null) {
            const deltaX = e.clientX - startX
            newWidth = Math.max(currentWidth + deltaX, 1)
            if (currentTDELList) {
              for (const el of currentTDELList) {
                el.style.minWidth = `${newWidth}px`
                el.style.maxWidth = `${newWidth}px`
              }
            }
          }
        })
      }
    }

    const setResizeDivStyle = (div: HTMLElement) => {
      div.style.setProperty('position', 'absolute')
      div.style.setProperty('top', '0')
      div.style.setProperty('right', '2px')
      div.style.setProperty('width', '4px')
      div.style.setProperty('height', '100%')
      div.style.setProperty('background', '#000')
      div.style.setProperty('cursor', 'col-resize')
      div.style.setProperty('z-index', '1')
      div.classList.add('resize-handle')
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
    const thList = table.querySelectorAll('th')

    const style = document.createElement('style')
    style.textContent = `
      .resize-cursor-th th:hover {
      cursor: col-resize !important;
      }
    `
    document.head.appendChild(style)

    for (const th of thList) {
      if (!th.getAttribute('data')) {
        continue
      }

      const div = document.createElement('div')
      setResizeDivStyle(div)
      div.addEventListener('mousedown', (e) => {
        table.classList.add('resize-cursor-th')
        mousedown(th.getAttribute('data') || '', e)
      })
      div.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
      })
      th.appendChild(div)
      th.style.position = 'relative'
    }

    map.set(el, () => {
      console.log('clear')
      document.head.removeChild(style)
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)

      thList.forEach((th) => {
        const div = th.querySelector('.resize-handle')
        div && th.removeChild(div)
      })
    })
  },
  unmounted(el: HTMLElement) {
    const clear = map.get(el)
    clear && clear()
  },
}
