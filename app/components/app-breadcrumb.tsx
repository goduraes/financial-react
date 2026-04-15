import { Link } from "react-router";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "~/components/ui/breadcrumb"
  
const AppBreadcrumb = ({ data }: { data: { text: string, url?: string }[] }) => {
    return (
      <Breadcrumb>
        <BreadcrumbList>
            {data.map((item, i) => (
                <BreadcrumbList key={i}>
                    {i + 1 !== data.length ? (
                        <>                        
                            <BreadcrumbItem >
                                <BreadcrumbLink asChild>
                                    {item.url ? (
                                        <Link to={item.url || ''}>{item.text}</Link>
                                    ) : (
                                        <span>{item.text}</span>
                                    )}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{item.text}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )
                }
                </BreadcrumbList>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
}

export default AppBreadcrumb