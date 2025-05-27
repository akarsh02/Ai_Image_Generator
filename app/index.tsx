import { Stack, Link } from 'expo-router';
import {Image, Text,View,TextInput,TouchableOpacity,ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dropdown} from "react-native-element-dropdown";
import {useState} from "react";
import {getImageDimensions} from "../utils/helpers";

const examplePrompts = [
    "A jogger running fast, happy expression, airbrush caricature",
    "A futuristic hopeful busy city, purple and green color scheme",
    "llustration of dinosaurs drawn by a child, the illustrations are cute and heartwarming",
    "A futuristic cityscape with flying cars and futuristic buildings",
    "A vintage red convertible driving along a winding coastal road at sunset, with the ocean waves crashing against rugged cliffs and seagulls soaring in the sky",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "Generate an image featuring celestial bodies in the vastness of space. Include planets, stars, and galaxies to create a captivating cosmic scene",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings",
    "A floating island with waterfalls pouring into clouds below",
    "A Young Woman Sitting on a Wooden Bench in a Sunlit Park, with Flowers in the Background",
    "A robot painting in a sunny studio with art supplies around it",
    "A magical library with floating glowing books and spiral staircases",
    "Generate an image capturing the moon landing, featuring a lone astronaut standing on the lunar surface. Show the Apollo 11’s Eagle module sitting nearby",
    "A cosmic beach with glowing sand and an aurora in the night sky",
    "A medieval marketplace with colorful tents and street performers",
    "A cyberpunk city with neon signs and flying cars at night",
    "A peaceful bamboo forest with a hidden ancient temple",
    "A giant turtle carrying a village on its back in the ocean",
    "Futuristic Flying Car Soaring Above a Sprawling Cityscape",
];



export default function Home() {
    const modelData = [
        {label: "FLUX.1-dev", value: "black-forest-labs/FLUX.1-dev"},
        {label: "FLUX.1-schnell", value: "black-forest-labs/FLUX.1-schnell"},
        {label: "Stable Diffusion 3.5L", value: "stabilityai/stable-diffusion-3.5-large"},
        {label: " Stable Diffussion XL", value: "stabilityai/stable-diffusion-xl-base-1.0"},
        {label: "Stable Diffusion v1.5", value: "stable-diffusion-v1-5/stable-diffusion-v1-5"},

    ]
    const aspectRationData =[
        {label:"1/1", value:"1/1"},
        {label:"16/9", value:"16/9"},
        {label:"9/16", value:"9/16"},
    ]
    const [prompt, setPrompt] = useState<string>('');
    const [model, setModel] = useState<string>("");
    const [aspectRation, setAspectRation] = useState<string>("");
    const[loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<any>("");

    const generatePrompt = () => {
        const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
        setPrompt(prompt);
    };
    const generateImage = async () => {
        setLoading(true);
        const MODEL_URL =`https://router.huggingface.co/hf-inference/models/${model}`
        const {width,height} =getImageDimensions(aspectRation)
        try {
            const response = await fetch(MODEL_URL, {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
                    "Content-Type": "application/json",
                }
                ,
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                    width: width,
                    height: height,
                    }
                }),
            })
            if(!response.ok) throw new Error((await response.json()).error);
                const result = await response.blob();
                const fileReader = new FileReader();
                fileReader.readAsDataURL(result);
                fileReader.onloadend = () => {
                    const base64 = fileReader.result;
                    setImage(base64 as string);
                }
                setImage(result);

        }catch (e) {
            console.log(e)
        }
        setLoading(false);
    }

    return (
    <>
      <Stack.Screen
          options={{
          title: 'Home',
          headerStyle: { backgroundColor:"#1E3E62" },
          headerTitleStyle: { color:"white" }
      }}
      />
        <View className="flex-1 p-[20px] bg-background">
            <View className="h-60">
            <TextInput className="bg-dark p-[20px] rounded-lg border-2 border-accent text-text h-40 font-medium text-lg "
                placeholder = "Describe your imagination in details...."
                placeholderTextColor="white"
            numberOfLines={3}
                       value={prompt}
                       onChangeText={(text) => setPrompt(text)}
            multiline={true}/>

                <TouchableOpacity onPress = {()=>{generatePrompt()}}>
                    <FontAwesome5 className="bg-accent p-4 rounded-full self-end relative bottom-[60] right-5 " name="dice" size={20} color="black" />
                </TouchableOpacity>
            </View>
            <Dropdown
                data={modelData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Model"
                onChange={(text) => setModel(text.value)}
                value={model}
            />
            <View className="mt-20">
            <Dropdown
                data={aspectRationData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Aspect Ratio"
                onChange={(text) => setAspectRation(text.value)}
                value={aspectRation}
            />
                <TouchableOpacity onPress={()=>generateImage()} className="bg-accent rounded-2xl justify-center items-center w-1/2 p-4 self-center mt-10">
                        <Text>Generate</Text>
                </TouchableOpacity>
            </View>
            <View className="h-[300px] w-4/5 self-center mt-7 items-center border-2 border-accent">
            { loading ?
                <ActivityIndicator className="self-center" size="large" color="#0000ff" animating={loading} />:

                image && <View className="h-[290px] w-4/5">
                <Image className="w-full h-full" source={{ uri: image }} />
                <View className="justify-between flex-row relative bottom-0 top-20">
                <TouchableOpacity className="mx-6" onPress = {()=>{}}>
                    <FontAwesome5 className="bg-accent p-4 rounded-full self-end relative bottom-[60] right-5 " name="download" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress = {()=>{}}>
                    <FontAwesome5 className="bg-accent p-4 rounded-full self-end relative bottom-[60] right-5 " name="share" size={20} color="black" />
                </TouchableOpacity>
            </View>
            </View>}
            </View>
        </View>
        </>
  );
}
