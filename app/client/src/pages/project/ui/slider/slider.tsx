import { Section } from 'shared/ui'

import styles from './slider.module.css'
import { useUnit } from 'effector-react'
import { $isSliderActive } from 'pages/project/model'
import useEmblaCarousel from 'embla-carousel-react'
import { carouselOptions } from 'pages/project/config'


interface Props {
    children?: React.ReactNode
}

    export const Slider = ({children}: Props) => {
        const isSliderActive = useUnit($isSliderActive)
        
        // const [startIndex, setStartIndex] = useState(0)
    
        const [carouselRef] = useEmblaCarousel({...carouselOptions})
    
        // carouselApi?.on('slidesInView', () => {
        //     if(startIndex !== carouselApi.selectedScrollSnap()) setStartIndex(carouselApi.selectedScrollSnap())
        // })
    
        return (
            <Section className={styles.slider}>
                    <div className={styles.slides}>
                        {children}
                    </div>
            </Section>
        )
    }