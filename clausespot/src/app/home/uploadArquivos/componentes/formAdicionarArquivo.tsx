import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { fileToBase64 } from "@/utils/fileToBase4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Router, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addArquivoSchema = z.object({
    // codigo: z.coerce.number(),
    nome: z.string(),
    data_registro: z.string(),
    base64: z.string()

})

type addArquivoFormType = z.infer<typeof addArquivoSchema>;

interface AddArquivoFormProps {
    children: React.ReactNode
    setPendent: (pendent: boolean) => void
    closeDialog: () => void
    listaArquivos: any[]
    setListaArquivos: React.Dispatch<React.SetStateAction<any[]>>
}

export const FormAdicionarArquivo: React.FC<AddArquivoFormProps> = ({   children, setPendent, closeDialog, listaArquivos, setListaArquivos }) => {
    const [cpfPaciente, setCpfPaciente] = useState("")
    const router = useRouter()
    const userId = localStorage.getItem("prontobook_user_id");

    const AddArquivoForm = useForm<addArquivoFormType>({
        resolver: zodResolver(addArquivoSchema)
    })
    
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = AddArquivoForm

    const handleFormSubmit = async (data: any) => {
        setListaArquivos(prev => [...prev, data])
        console.log("Dados: ", data)
        console.log("Lista: ", listaArquivos)
    }
    
    const handleError = (errors: any) => {
        console.log("Erros no Zod: ", errors)
    }
    
    return (
        <Form {...AddArquivoForm}>
            <form onSubmit={AddArquivoForm.handleSubmit(handleFormSubmit, handleError)} className="grid grid-cols-2 max-h-[80vh] overflow-y-auto gap-x-4 gap-y-2 p-4">

                        {/* <FormField
                            control={AddArquivoForm.control}
                            name="codigo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="number"
                                    className="border border-black-300 rounded-md p-2 file:border-0 file:bg-blue-100 file:text-gray-700 file:mr-2"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={AddArquivoForm.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Arquivo</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="text"
                                    className="border border-black-300 rounded-md p-2 file:border-0 file:bg-blue-100 file:text-gray-700 file:mr-2"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={AddArquivoForm.control}
                            name="data_registro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Registro</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    type="date"
                                    className="border border-black-300 rounded-md p-2 file:border-0 file:bg-blue-100 file:text-gray-700 file:mr-2"
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={AddArquivoForm.control}
                            name="base64"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Arquivo</FormLabel>
                                <FormControl>
                                    <Input
                                    type="file"
                                    accept="pdf/*"
                                    className="border border-black-300 rounded-md p-2 file:border-0 file:bg-blue-100 file:text-gray-700 file:mr-2"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        try {
                                        const base64String = await fileToBase64(file)
                                        field.onChange(base64String)
                                        } catch (err) {
                                        console.error("Erro ao converter imagem:", err)
                                        }
                                    }}
                                    />
                                    
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                <Separator className="col col-span-2 mt-5 mb-5 "/>

                <div className="col col-span-2 mt-10">
                    <Button type="submit">
                        Salvar
                    </Button>
                </div>
            </form>
        </Form>
    )
}