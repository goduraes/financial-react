import { Spinner } from "~/components/ui/spinner"

const AppLoadingScreen = () => {
    return (
        <div className="absolute flex justify-center items-center z-50 bg-secondary/50 w-full h-full">
            <Spinner className="size-10" />
        </div>
    );
}

export default AppLoadingScreen;