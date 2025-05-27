export const getImageDimensions = (aspectRatio:string,baseSize=512) => {
    const [width,height] = aspectRatio.split("/")
    const scaleFactor = baseSize/Math.sqrt(Number(width)*Number(height))

    let calculateHeight = Math.round(height * scaleFactor)
    let calculateWidth = Math.round(width * scaleFactor)

    calculateHeight = Math.floor(calculateHeight/16)*16;
    calculateWidth = Math.floor(calculateWidth/16)*16;
    return {width:calculateWidth, height:calculateHeight}
}